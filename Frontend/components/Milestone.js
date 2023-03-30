import React,{Fragment, useEffect, useState, useLayoutEffect, useRef} from "react";
import { useAuth } from "@/context/AuthContext";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "@/config/firebase";
import { PlusIcon } from "@heroicons/react/24/outline";
import MilestoneModal from "./MilestoneModal";
import { Listbox, Transition } from '@headlessui/react'
import { CalendarIcon, PaperClipIcon, TagIcon, UserCircleIcon } from '@heroicons/react/20/solid'

const assignees = [
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

export default function Milestone(pid) {
  const [showModal, setShowModal] = useState(false);
  const{ user }= useAuth();
  const [assigned, setAssigned] = useState(assignees[0])
  const [labelled, setLabelled] = useState(labels[0])
  const [dated, setDated] = useState(dueDates[0])
  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedMilestones, setSelectedMilestones] = useState([])
  const[milestones, setMilestones] =useState([])
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid.pid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch("http://localhost:3000/api/getMilestones", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result))

        setMilestones(JSON.parse(result)[0])
        milestones.map((m)=>{console.log(m.split(",")[0],m.split(",")[1],m.split(",")[2],m.split(",")[3])})
    })
      .catch((err) => {
        console.log(err);
      });
}, []);

  useLayoutEffect(() => {
    const isIndeterminate = selectedMilestones.length > 0 && selectedMilestones.length < milestones.length
    setChecked(selectedMilestones.length === milestones.length)
    setIndeterminate(isIndeterminate)
    checkbox.current.indeterminate = isIndeterminate
  }, [selectedMilestones])

  function toggleAll() {
    setSelectedMilestones(checked || indeterminate ? [] : milestones)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }
  const addMilestone= ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(pid)

    var raw = JSON.stringify({
      pid: pid.pid,
      "milestone":  {
        title: 'Create login UI',
        assignedto: 'Lindsay Walton',
        labels: 'Frontend',
        duedate: '10/14/2022',
        complete:false
      },
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/api/addMilestone", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setUserInfo(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
    refreshPage()
  }

  useEffect(() => {
    if(user.uid)
    {
      updateDoc(doc(db, "users", user.uid), {
        currentProjPage:"#MS"
      })
    }
  }, []);
  return (
    <div>

        <div className="px-4 sm:px-6 py-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">Milestones</h1>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                    type='button'
                    className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={addMilestone}
                    >
                    AddMileStone
                    <PlusIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
                </button>
                <button
                    type='button'
                    className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={() => setShowModal(true)}
                    >
                    Create new Milestone
                    <PlusIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
                </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="relative">
                    {selectedMilestones.length > 0 && (
                        <div className="absolute top-0 left-14 flex h-12 items-center space-x-3 bg-white sm:left-12">
                        <button
                            type="button"
                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        >
                            Bulk edit
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        >
                            Mark all as complete
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
                        {milestones.map((milestone) => (
                            <tr key={milestone.split(",")[3]} className={selectedMilestones.includes(milestone) ? 'bg-gray-50' : undefined}>
                            <td className="relative px-7 sm:w-12 sm:px-6">
                                {selectedMilestones.includes(milestone) && (
                                <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                )}
                                <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                value={milestone.split(",")[3]}
                                checked={selectedMilestones.includes(milestone)}
                                onChange={(e) =>
                                    setSelectedMilestones(
                                    e.target.checked
                                        ? [...selectedMilestones, milestone]
                                        : selectedMilestones.filter((p) => p !== milestone)
                                    )
                                }
                                />
                            </td>
                            <td
                                className={classNames(
                                'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                                selectedMilestones.includes(milestone) ? 'text-indigo-600' : 'text-gray-900'
                                )}
                            >
                                {milestone.split(",")[0]}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.split(",")[1]}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.split(",")[2]}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.split(",")[3]}</td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                Edit<span className="sr-only">, {milestone.title}</span>
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
        <MilestoneModal isVisible={showModal} onClose={() => setShowModal(false)}>
            <div>
              <form className="relative" onSubmit={handleMilstones}>
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
                    value={title}
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
                    value={description}
                    onChange={(e) => setDescription(e.tartget.value)}
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
                                {assigned.value === null ? (
                                <UserCircleIcon className="h-5 w-5 flex-shrink-0 text-gray-300 sm:-ml-1" aria-hidden="true" />
                                ) : (
                                <img src={assigned.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                )}

                                <span
                                className={classNames(
                                    assigned.value === null ? '' : 'text-gray-900',
                                    'hidden truncate sm:ml-2 sm:block'
                                )}
                                >
                                {assigned.value === null ? 'Assign' : assigned.name}
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
                                    key={assignee.value}
                                    className={({ active }) =>
                                        classNames(
                                        active ? 'bg-gray-100' : 'bg-white',
                                        'relative cursor-default select-none py-2 px-3'
                                        )
                                    }
                                    value={assignee}
                                    >
                                    <div className="flex items-center">
                                        {assignee.avatar ? (
                                        <img src={assignee.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                        ) : (
                                        <UserCircleIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        )}

                                        <span className="ml-3 block truncate font-medium">{assignee.name}</span>
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
                    <div className="flex">
                        <button
                        type="button"
                        className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400"
                        >
                        <PaperClipIcon className="-ml-1 mr-2 h-5 w-5 group-hover:text-gray-500" aria-hidden="true" />
                        <span className="text-sm italic text-gray-500 group-hover:text-gray-600">Additional files</span>
                        </button>
                    </div>
                    <div className="flex-shrink-0 space-x-3">
                        <button
                        type="submit"
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