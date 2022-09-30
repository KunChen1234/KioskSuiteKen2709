import persontest from './persontest.jpg'

function Personalinfo() {
    const info = [
        // { "name": "ck", "id": "1" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        // { "name": "cc", "id": "2" },
        { "name": "cc", "id": "2" }];
    Array.from(info).map(entry => {
        console.log(typeof entry)
    })

    return (
        <div className="grid grid-cols-9 gap-5 gap-y-12">
            {Array.from(info).map(entry => {
                return <div key={entry.name} className="max-w-48  bg-white shadow-lg grid grid-cols-2">
                    <div className="clo-span-1">
                        <table>
                            <tbody>
                                <tr><td>Name: </td>
                                    <td>{entry.name}</td></tr>
                                <tr><td>ID: </td><td>{entry.id}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="clo-span-1">
                        <img src={persontest}></img>
                    </div>
                </div>

            })}

        </div>
    );
}
export default Personalinfo;