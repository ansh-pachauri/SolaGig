

"use client"
import { BackendUrl } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react"

interface Task {
    "id": number,
    "amount": number,
    "title": string,
    "options": {
        id: number;
        image_url: string;
        task_id: number
    }[]
}

// CSR
export const NextTask = () => {
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const reponse =  axios.get(`${BackendUrl}/v1/worker/nextTask`, {
            headers: {
                 "Authorization": `Bearer ${token}`
            }
            
        })
        
            .then(res => {
                setCurrentTask(res.data.task);
                setLoading(false)
            })
            .catch(e => {
                setLoading(false)
                setCurrentTask(null)
            })
    console.log(reponse);

    }, [])
    console.log("currentTask", currentTask);
    
    if (loading) {
        return <div className="h-screen flex justify-center flex-col">
            <div className="w-full flex text-white justify-center text-2xl">
                Loading...
            </div>
        </div>
    }

    if (!currentTask) {
        return <div className="h-screen flex justify-center flex-col">
            <div className="w-full flex justify-center text-2xl text-white font-bold">
                Please check back in some time, there are no pending tasks at the moment.
            </div>
        </div>
    }

    return <div>
        <div className='text-2xl pt-20 flex justify-center'>
            {currentTask.title}
            <div className="pl-4 text-white font-semibold">
                {submitting && "Submitting..."}
            </div>
        </div>
        <div className='flex justify-center pt-8'>
            {currentTask.options.map(option => <Option onSelect={async () => {
                setSubmitting(true);
                try {
                    const response = await axios.post(`${BackendUrl}/v1/worker/submission`, {
                        taskId: currentTask.id.toString(),
                        selection: option.id.toString()
                    }, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    });
    
                    const nextTask = response.data.nextTask;
                    if (nextTask) {
                        setCurrentTask(nextTask)
                    } else {
                        setCurrentTask(null);
                    }
                    // refresh the user balance in the appbar
                } catch(e) {
                    console.log(e);
                }
                setSubmitting(false);

            }} key={option.id} imageUrl={option.image_url} />)}
        </div>
    </div>
}

function Option({imageUrl, onSelect}: {
    imageUrl: string;
    onSelect: () => void;
}) {
    return <div>
        <img onClick={onSelect} className={"p-2 w-96 rounded-md"} src={imageUrl} />
    </div>
}