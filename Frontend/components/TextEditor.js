import {useState,useEffect}from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Router from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/config/firebase';
import { query, collection,getDocs} from 'firebase/firestore';
import {EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { updateState } from '@/fireStoreBE/UserDoc';

function TextEditor() {
    const{user} = useAuth();
    const [state,setState] =useState(EditorState.createEmpty())
    const{id} =Router.query;
    const onEditChange =async (state) =>{
        setState(state)
        updateState(user.email, id, convertToRaw(state.getCurrentContent()))
    }
    const getState  = async() => {
        const q = query(
            collection(db, "userDocs", user.email,"docs")
          );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
            if(doc.id === id)
            {
                if(doc.data().state)
                {
                    setState(EditorState.createWithContent(
                        convertFromRaw(doc.data().state)
                    ))
                }
            }})
    }
    useEffect( () => {

        getState()
      }, []);
  return (
    <div 
    className='bg-[#F8F9FA] min-h-screen pb-16'
    >
        <Editor
            editorState = {state}
            onEditorStateChange={onEditChange}
            toolbarClassName='flex sticky top-0 z-50 !justify-center mx-auto'
            editorClassName='mt-6  p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border '
            toolbar={{
                options: [
                    "inline",
                    "list",
                    "textAlign",
                    "history",
                  ],
              }}
        />
    </div>
  )
}

export default TextEditor