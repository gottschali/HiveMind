import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'


export default function GameList( ) {
    const [games, setGames] = useState([]);
    useEffect( () => {
        fetch('/game')
            .then( resp => resp.json())
            .then( data => setGames(data))
            .catch( err => console.log(err))
    }, [])
    return (
        <table>
            {games.map( gid => {
                return (
                <tr key={gid}> 
                    <td> ID: {gid} </td>
                    <td> <Link to = {{
                        pathname: `/play/${gid}`,
                        search: `?p1=remote&p2=local`
                    }}> JOIN </Link></td>
                </tr>
                )
            })}
        </table>
    )
}