import { useContext, useState, useEffect, useCallback } from "react"
import { useHttp } from "../../../hooks/http-hook"
import { AuthContext } from "../../../context/AuthContext"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ItemCard(props) {
    const {t} = useTranslation()
    const {request, loading} = useHttp()
    const {token} = useContext(AuthContext)
    const navigate = useNavigate()
    const number = props.number
    const [data, setData] = useState([])
    const [classroomInfo, setClassroomInfo] = useState({})
    const fetchItem = useCallback(async () => {
        try {
            const fetched = await request('/api/item/bynumber/'+number, 'GET', null,  {'Authorization': 'Bearer ' + token})
            setData(fetched)
            
            const classroom = await request('/api/classroom/'+fetched[0].classroomId, 'GET', null, {'Authorization': 'Bearer ' + token})
            setClassroomInfo(classroom)
            
        } catch(e){}
    }, [request])
    

    useEffect(() => {
        fetchItem()
    }, [fetchItem])

    return (
        <>
        {loading && <h3>{t('Loading...')}</h3>}
        {(!loading && data.length === 0) && <div className="no-item-found">
                            <p>{t('No item found')}</p>
                            <a href={"admin/createnew/" + number}>{t('Create new item')}</a>
                        </div>}
        {!loading && data.map(data => <div className="item-card">
            
            {!loading &&
                <>
                    
                        
                    
                    
                        <div className="item-details">
                            <div className="item-number">{t('Barcode')}: {number}</div>
                            <br/>
                            <br/>
                            <p>{t('Name')}: {data.name}</p>
                            <p>{t('Description')}: {data.description}</p>
                            <p>{t('Condition')}:    {data.condition}</p>
                            <p>{t('Classroom number')}: {classroomInfo.classroomName}</p>
                            <p><img height={150} width={170} src={data.iconUrl}/></p>
                            <div><button onClick={() => {navigate('/admin/edititem/' + data.id)}}>{t('edit')}</button></div>
                        </div>
                    
                </>
            }
        </div>)}
        {(!loading && data.length > 0) &&<div className="no-item-found">
                            <a href={"admin/createnew/" + number}>{t('Create new item')}</a>
                        </div>}
        </>
    )
}

{/*  */}