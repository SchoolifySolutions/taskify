import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar';

export default function Team() {
    const token = localStorage.getItem("access_token");
    const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Student"]}');
    const [departments, setDepartments] = useState({});

    const fetchData = async () => {
        const response = await axios.post(`${import.meta.env.VITE_URL}getteambydept/`, {
            departments: usrData["Departments"],
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log(response.data.departments);
        setDepartments(response.data.departments);
    }

    useEffect(() => { fetchData() }, []);

    return (
        <div className="flex">
            <Sidebar name={"Team"} />
            <div className="absolute right-0 top-0 h-screen w-[85vw] bg-black text-white">
                <div className="w-[80%] mx-auto py-8">
                <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Teams</h2>
            <p className="text-muted-foreground mb-[2vh]">
              Here are all the Teams you are a part of.
            </p>
          </div>
          <div className="h-[87vh] overflow-y-scroll">
                    {Object.keys(departments).map(department => (
                        <div key={department} className="mb-8 p-6 bg-neutral-800 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">{department}</h2>
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">Team Lead(s)</h3>
                                <div className="">
                                    {departments[department].team_lead.map((lead, index) => (
                                        <div key={index} className="mb-2 p-4 bg-neutral-700 rounded-lg">
                                            <div className="font-semibold">{lead.first_name} {lead.last_name} </div>
                                            <div className="text-sm text-gray-300">{lead.username}, <span className="font-normal text-gray-300">{lead.email}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Members</h3>
                                <div className="">
                                    {departments[department].members.length > 0 ? (
                                        departments[department].members.map((member, index) => (
                                            <div key={index} className="mb-2 p-4 bg-neutral-700 rounded-lg">
                                                <div className="font-semibold">{member.first_name} {member.last_name}</div>
                                                <div className="text-sm text-gray-300">{member.username}, <span className="font-normal text-gray-300">{member.email}</span></div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 bg-neutral-700 rounded-lg">No members</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
