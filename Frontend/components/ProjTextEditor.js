import {useState,useEffect}from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Router from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/config/firebase';
import { updateDoc, doc,query, collection,getDocs, serverTimestamp} from 'firebase/firestore';
import {EditorState, convertFromRaw, convertToRaw } from 'draft-js';

function ProjTextEditor() {
    const[ids, setIds]= useState(null);
    const[pid, setPid]= useState(null);
    const[docId, setDocId] = useState(null);
    useEffect(()=>{
        setIds(Router.query.id.split("DocId="))

    },[])

    useEffect(()=>{
        if(ids)
        {
            setPid(ids[0])
            setDocId(ids[1])
        }
    },[ids])
    const [state,setState] =useState(EditorState.createEmpty())
    const onEditChange =async (state) =>{
        setState(state)
        if(docId)
        {
            await updateDoc(doc(db, "projDocs", pid,"docs",docId), {
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
            if(doc.id === ids[1])
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
