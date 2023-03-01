const skills = [
  { id: 1, name: 'Java' },
  { id: 2, name: 'C' },
  { id: 3, name: 'C++' },
  { id: 4, name: 'Python' },
  { id: 5, name: 'React' },
]
  
  export default function SkillList() {
    return (
      <fieldset>
        <legend className="text-base font-semibold leading-6 text-gray-900">Skills</legend>
        <div className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
          {skills.map((skill, skillIdx) => (
            <div key={skillIdx} className="relative flex items-start py-4">
              <div className="min-w-0 flex-1 text-sm">
                <label htmlFor={`skill-${skill.id}`} className="select-none font-medium text-gray-700">
                  {skill.name}
                </label>
              </div>
              <div className="ml-3 flex h-5 items-center">
                <input
                  id={`skill-${skill.id}`}
                  name={`skill-${skill.id}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    )
  }