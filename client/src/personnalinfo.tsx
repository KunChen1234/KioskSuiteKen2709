function Personalinfo() {
    const info = [{ "name": "ck", "id": "1" }, { "name": "cc", "id": "2" }];

    return (<div>
        <label >a</label>
        <p>
            {Array.from(info).map(entry => {
                return <p>{entry.name}</p>
            })}

        </p>
    </div>);
}
export default Personalinfo;