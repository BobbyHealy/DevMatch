import React from 'react'
import Skill from './Skill'

export default function SkillList({skills}) {
  return (
    skills.map(skill =>{
        return <Skill skill = {skill}/>
    })
  )
}
