import { useRouteError,useNavigate} from 'react-router-dom'

export default function Error(){
    const error = useRouteError()
    const navigate = useNavigate()
    return(
        <div>
        <h2>{error.status} & {error.message}</h2>
        <button type="button" onClick={() => navigate('/')}>Return Home</button>
        </div>
    )
}