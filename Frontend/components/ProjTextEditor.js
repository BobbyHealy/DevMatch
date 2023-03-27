import {useState,useEffect}from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/config/firebase';
import { 
    updateDoc, 
    doc,
    query, 
    collection,
    getDocs, 
    serverTimestamp, 
    onSnapshot
} from 'firebase/firestore';
import {EditorState, convertFromRaw, convertToRaw } from 'draft-js';

function ProjTextEditor({pid,docId}) {

    const [state,setState] =useState(EditorState.createEmpty())
    const {userInfo} = useAuth()
    const onEditChange =async (state) =>{
        setState(state)
        if(docId)
        {
            await updateDoc(doc(db, "projDocs", pid,"docs",docId), {
                lastEditBy: userInfo.name,
                lastEdit: serverTimestamp(),
                state: convertToRaw(state.getCurrentContent())
              });
        }

    }
    const getState  = async() => {
        const q = query(
            collection(db, "projDocs", pid,"docs")
          );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
            if(doc.id === docId)
            {

                if(doc.data().state)
                {
                    setState(EditorState.createWithContent(
                        convertFromRaw(doc.data().state)
                    ))

                    
                }

            }})
        await onSnapshot(doc(db, "projDocs", pid,"docs",docId), (doc) => {

            if(doc.data())
            {
                setOState(EditorState.createWithContent(
                    convertFromRaw(doc.data().state)
                ))
                if(doc.data().lastEditBy!==userInfo.name)
                {
                    setState(EditorState.createWithContent(
                        convertFromRaw(doc.data().state)
                    ))
    
                }
            }

        })
    

       
    }
    useEffect( () => {

        pid&&docId&&getState()
      }, [pid,docId]);
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

export default ProjTextEditor
