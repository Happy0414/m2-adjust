import './ScheduleFormModal.css'

//type Status = "ok" | "pen" | "no"

type props = {
    isOpen: boolean
    schedule: string
}

function ScheduleFormModal({isOpen, schedule}: props){
    if(!isOpen) return null

    return(
        <div>
            <div className="overLay">
                <div className="modalBox">
                    <p>{schedule}</p>
                </div>
            </div>
        </div>
    )
}

export default ScheduleFormModal