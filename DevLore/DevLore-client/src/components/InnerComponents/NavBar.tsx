import { FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => (
    {
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Navbar: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    return (
        <div style={{ display: 'flex', border: '2px solid lightgray', padding: '5px', color: '#371F76' }}>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/Feed'>
            Feed</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/UserProfile'>
            UserProfile</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/Post'>
            Post</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/CreatePost'>
            CreatePost</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/Search'>
            Search</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/Home'>
            Home</Link>
        </div>
    )
}

export default connector(Navbar)