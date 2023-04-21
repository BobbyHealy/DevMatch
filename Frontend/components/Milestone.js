import {Fragment, useEffect, useState, useLayoutEffect, useRef} from "react";
import { useAuth } from "@/context/AuthContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import MilestoneModal from "./MilestoneModal";
import { Listbox, Transition,Menu, Dialog } from '@headlessui/react'
import { CalendarIcon, PaperClipIcon, TagIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { switchProjPage } from "@/fireStoreBE/User"
import { v4 as uuid } from "uuid";
import { addMS, sendToApprove, approveRequest, denyRequest, deleteMS } from "@/fireStoreBE/Milestones";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/config/firebase";
import { 
    EllipsisVerticalIcon, 
  } from '@heroicons/react/20/solid'
import RequestedMS from "./RequestedMS";



const defaultAssignees = [
  { name: 'Unassigned', value: null },
  // More items...
]
const labels = [
  { name: 'Unlabelled', value: null },
  { name: 'Frontend', value: 'frontend' },
  { name: 'Backend', value: 'Backend' },
  // More items...
]
const dueDates = [
  { name: 'No due date', value: null },
  { name: 'Today', value: 'today' },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
function refreshPage() {
    window.location.reload(false);
  }

export default function Milestone({pid, project}) {
  const [showModal, setShowModal] = useState(false);
  const{ user }= useAuth();
  const [assigned, setAssigned] = useState(defaultAssignees[0])
  const [labelled, setLabelled] = useState(labels[0])
  const [dated, setDated] = useState(dueDates[0])
  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedMilestones, setSelectedMilestones] = useState([])
  const[milestones, setMilestones] = useState([])
  const [title, setTitle] = useState("")
  const [assignees, setAsignees] =useState(defaultAssignees)
  const [members, setMembers] = useState()
  const [open, setOpen] = useState(false)
  const handleShow= ()=>{
    setOpen(true)
  }
  useEffect(() => {
    fetchMS()

}, []);



useEffect(() => {
    if(members)
    {
        const data =[
            ...assignees,
            ...members
        ]
        setAsignees(data)
    }
  }, [members]);

useEffect(() => {
    if (project)
    {
        var tmem = []
        project.tmembers.map((mem)=>{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                userID: mem,
            });
            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
            };
            fetch("http://localhost:3000/api/getUser", requestOptions)
              .then((response) => response.text())
              .then((result) => 
              {
                tmem.push(JSON.parse(result))
                if(project.tmembers.length===tmem.length)
                {
                  setMembers(tmem)
                }
              }
              )
              .catch((err) => {
                console.log(err);
              });
          })
    }
}, [project]);
    const fetchMS  = async () => 
    {
        const unsub = onSnapshot(collection(db, "Projects", pid, "MileStones"), (ms) => {
        console.log(ms.docs)
        setMilestones(ms.docs)
        });

        return () => {
            unsub();
        };

    }
    const handleMarkComplete =()=>
    {
        selectedMilestones.forEach(ms=>{
            if (project.owners?.includes(user.uid))
            {
                approveRequest(pid, ms.id)
            }
            else
            {
                sendToApprove(pid, ms.id)
            }
        })

        
    }

    useLayoutEffect(() => {
        const isIndeterminate = selectedMilestones?.length > 0 && selectedMilestones.length < milestones.length
        setChecked(selectedMilestones?.length === milestones?.length)
        setIndeterminate(isIndeterminate)
        checkbox.current.indeterminate = isIndeterminate
    }, [selectedMilestones])

    function toggleAll() {
        setSelectedMilestones(checked || indeterminate ? [] : milestones)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }
    const addMilestone= async ()=>{
        if(title.trim())
        {
            await addMS(pid, uuid(), title.trim(),assigned.name,dated.name,labelled.name)
            setShowModal(false)
        }
        
    }
    
    useEffect(() => {
        if(user.uid)
        {
            switchProjPage(user.uid, "#MS")
        }
    }, []);

  return (
    <div>

        <div className="px-4 sm:px-6 py-6 lg:px-8 h-[calc(50vh)]">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Milestones</h1>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                {project.owners?.includes(user.uid)&&<button
                    type='button'
                    className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={() => setShowModal(true)}
                    >
                    Create new Milestone
                    <PlusIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
                </button>}
                </div>
                <Menu as="div" className=" relative inline-block text-left">
            <div>
              {project.owners?.includes(user.uid)&&<Menu.Button className="flex items-center  bg-blue h-12 text-gray-400 hover:text-gray-200 focus:outline-none p-3">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>}
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md  shadow-lg bg-gray-100 ring-1 ring-gray-700 focus:outline-none">
                <div className="py-1">
                  {<Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={handleShow}
                        className={classNames(
                          active ? 'bg-gray-100 text-black' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                       Show Request
                      </a>
                    )}
                  </Menu.Item>}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-blue-300 h-[calc(90vh)]  w-[calc(50%)] px-4 pb-4 pt-5 text-left shadow-xl transition-all ">
                  <div>
                    <div className="mt-3 text-center sm:mt-5 ">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 ">
                        Request
                      </Dialog.Title>
                      <div className="mt-2 h-[calc(90vh)] w-[calc(100vw-246px)] overflow-scroll ">
                        {milestones.map((ms) => (
                          ms.data().pending&&<RequestedMS pid={pid} MSID={ms.id} title={ms.data().title} assign={ms.data().assignee} label={ms.data().label}/>
                        ))}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
            </div>
            <div className="mt-8 flow-root">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="relative">
                    {selectedMilestones?.length > 0 && (
                        <div className="absolute top-0 left-14 flex h-12 items-center space-x-3 bg-white sm:left-12">
                        <button
                            type="button"
                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        >
                            Bulk edit
                        </button>
                        <button
                            onClick={handleMarkComplete}
                            type="button"
                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        >
                            {project.owners?.includes(user.uid)?"Mark all as complete":"Send Complete Request"}
                        </button>
                        </div>
                    )}
                    <table className="min-w-full table-fixed divide-y divide-gray-300">
                        <thead>
                        <tr>
                            <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                            <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                ref={checkbox}
                                checked={checked}
                                onChange={toggleAll}
                            />
                            </th>
                            <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                            Title
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Assingned to
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Labels
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Due Date
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                            <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {milestones?.map((milestone) => (
                            !milestone.data().complete&&<tr key={milestone.data().dueDate} className={selectedMilestones?.includes(milestone) ? 'bg-gray-50' : undefined}>
                            <td className="relative px-7 sm:w-12 sm:px-6">
                                {selectedMilestones?.includes(milestone) && (
                                <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                )}
                                <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                value={milestone.data().dueDate}
                                checked={selectedMilestones?.includes(milestone)}
                                onChange={(e) =>
                                    setSelectedMilestones(
                                    e.target.checked
                                        ? [...selectedMilestones, milestone]
                                        : selectedMilestones?.filter((p) => p !== milestone)
                                    )
                                }
                                />
                            </td>
                            <td
                                className={classNames(
                                'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                                selectedMilestones?.includes(milestone) ? 'text-indigo-600' : 'text-gray-900'
                                )}
                            >
                                {milestone.data().title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.data().assignee}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.data().label}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.data().dueDate}</td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                Edit<span className="sr-only">, {milestone.data().title}</span>
                                </a>
                            </td>
                            </tr>
                        ))}
                        </tbody>
            
                    </table>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div className="h-[calc(50vh)] bg-gray-300 px-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">Completed Milestones</h1>
                    <table className="min-w-full table-fixed divide-y divide-gray-300 ">
                        <thead>
                        <tr>
                            <th ref={checkbox} className="hidden">
            
                            </th>
                            <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                            Title
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Assingned to
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Labels
                            </th>

                        </tr>
                        </thead>
                   
                    <tbody className="divide-y divide-gray-200 bg-gray-400">
                        {milestones?.map((milestone) => (
                            milestone.data().complete&&<tr key={milestone.data().dueDate} className={selectedMilestones?.includes(milestone) ? 'bg-gray-50' : undefined}>
                           
                            <td
                                className={classNames(
                                'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                                selectedMilestones?.includes(milestone) ? 'text-indigo-600' : 'text-gray-900'
                                )}
                            >
                                {milestone.data().title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.data().assignee}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.data().label}</td>

          
                            </tr>
                        ))}
                        </tbody>
                        
                        </table>
                        </div>
        <MilestoneModal isVisible={showModal} onClose={() => setShowModal(false)}>
            <div>
              <form className="relative">
                <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <label htmlFor="title" className="sr-only">
                    Title
                    </label>
                    <input
                    type="text"
                    name="title"
                    id="title"
                    className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="description" className="sr-only">
                    Description
                    </label>
                    <textarea
                    rows={2}
                    name="description"
                    id="description"
                    className="block w-full resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Write a description..."
                    defaultValue={''}
                    />

                    {/* Spacer element to match the height of the toolbar */}
                    <div aria-hidden="true">
                    <div className="py-2">
                        <div className="h-9" />
                    </div>
                    <div className="h-px" />
                    <div className="py-2">
                        <div className="py-px">
                        <div className="h-9" />
                        </div>
                    </div>
                    </div>
                </div>

                <div className="absolute inset-x-px bottom-0">
                    {/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}
                    <div className="flex flex-nowrap justify-end space-x-2 py-2 px-2 sm:px-3">
                    <Listbox as="div" value={assigned} onChange={setAssigned} className="flex-shrink-0">
                        {({ open }) => (
                        <>
                            <Listbox.Label className="sr-only"> Assign </Listbox.Label>
                            <div className="relative">
                            <Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">

                                <span
                                className={classNames(
                                    assigned.value? '' : 'text-gray-900',
                                    'hidden truncate sm:ml-2 sm:block'
                                )}
                                >
                                {assigned.value? 'Assign' : assigned.name}
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {assignees.map((assignee) => (
                                    <Listbox.Option
                                    key={assignee?.value}
                                    className={({ active }) =>
                                        classNames(
                                        active ? 'bg-gray-100' : 'bg-white',
                                        'relative cursor-default select-none py-2 px-3'
                                        )
                                    }
                                    value={assignee}
                                    >
                                    <div className="flex items-center">

                                        <span className="ml-3 block truncate font-medium">{assignee?.name}</span>
                                    </div>
                                    </Listbox.Option>
                                ))}
                                </Listbox.Options>
                            </Transition>
                            </div>
                        </>
                        )}
                    </Listbox>

                    <Listbox as="div" value={labelled} onChange={setLabelled} className="flex-shrink-0">
                        {({ open }) => (
                        <>
                            <Listbox.Label className="sr-only"> Add a label </Listbox.Label>
                            <div className="relative">
                            <Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
                                <TagIcon
                                className={classNames(
                                    labelled.value === null ? 'text-gray-300' : 'text-gray-500',
                                    'h-5 w-5 flex-shrink-0 sm:-ml-1'
                                )}
                                aria-hidden="true"
                                />
                                <span
                                className={classNames(
                                    labelled.value === null ? '' : 'text-gray-900',
                                    'hidden truncate sm:ml-2 sm:block'
                                )}
                                >
                                {labelled.value === null ? 'Label' : labelled.name}
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {labels.map((label) => (
                                    <Listbox.Option
                                    key={label.value}
                                    className={({ active }) =>
                                        classNames(
                                        active ? 'bg-gray-100' : 'bg-white',
                                        'relative cursor-default select-none py-2 px-3'
                                        )
                                    }
                                    value={label}
                                    >
                                    <div className="flex items-center">
                                        <span className="block truncate font-medium">{label.name}</span>
                                    </div>
                                    </Listbox.Option>
                                ))}
                                </Listbox.Options>
                            </Transition>
                            </div>
                        </>
                        )}
                    </Listbox>

                    <Listbox as="div" value={dated} onChange={setDated} className="flex-shrink-0">
                        {({ open }) => (
                        <>
                            <Listbox.Label className="sr-only"> Add a due date </Listbox.Label>
                            <div className="relative">
                            <Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
                                <CalendarIcon
                                className={classNames(
                                    dated.value === null ? 'text-gray-300' : 'text-gray-500',
                                    'h-5 w-5 flex-shrink-0 sm:-ml-1'
                                )}
                                aria-hidden="true"
                                />
                                <span
                                className={classNames(
                                    dated.value === null ? '' : 'text-gray-900',
                                    'hidden truncate sm:ml-2 sm:block'
                                )}
                                >
                                {dated.value === null ? 'Due date' : dated.name}
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {dueDates.map((dueDate) => (
                                    <Listbox.Option
                                    key={dueDate.value}
                                    className={({ active }) =>
                                        classNames(
                                        active ? 'bg-gray-100' : 'bg-white',
                                        'relative cursor-default select-none py-2 px-3'
                                        )
                                    }
                                    value={dueDate}
                                    >
                                    <div className="flex items-center">
                                        <span className="block truncate font-medium">{dueDate.name}</span>
                                    </div>
                                    </Listbox.Option>
                                ))}
                                </Listbox.Options>
                            </Transition>
                            </div>
                        </>
                        )}
                    </Listbox>
                    </div>
                    <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
                    <div className="flex-shrink-0 space-x-3">
                        <button
                        type="button"
                        onClick={addMilestone}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Create
                        </button>
                        <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                        </button>
                    </div>
                    </div>
                </div>
                </form>
            </div>
        </MilestoneModal>
    </div>
    
  );
}