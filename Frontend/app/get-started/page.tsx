// 'use client'

// import { useState, useRef, useCallback, useEffect } from "react"
// import Header from "../components/header"
// import Footer from "../components/footer"
// import { createClient } from "@/utils/supabase/client"

// const supabase = createClient()

// export default function GetStarted() {
//   const [files, setFiles] = useState<File[]>([])
//   const [uploadStatus, setUploadStatus] = useState<string>("")
//   const [textStatus, setTextStatus] = useState<string>("")
//   const [user, setUser] = useState<any>(null)
//   const [userText, setUserText] = useState<string>("")
//   const [storedData, setStoredData] = useState<any[]>([])
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const textAreaRef = useRef<HTMLTextAreaElement>(null)

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data } = await supabase.auth.getUser()
//       setUser(data?.user ?? null)
//     }
//     fetchUser()
//   }, [supabase])

//   const autoSize = useCallback(() => {
//     if (textAreaRef.current) {
//       textAreaRef.current.style.height = "auto"
//       textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
//     }
//   }, [])

//   useEffect(() => {
//     autoSize()
//   }, [files, autoSize])

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (!user) {
//       alert("Please log in to upload files.")
//       return
//     }
//     if (event.target.files) {
//       const uploadedFiles = Array.from(event.target.files)
//       setFiles(uploadedFiles)
//       uploadedFiles.forEach(uploadFileToSupabase)
//     }
//   }

//   const uploadFileToSupabase = async (file: File) => {
//     if (!user) return
//     const prefixedName = `${user.id}_${file.name}`
//     setUploadStatus(`Uploading: ${prefixedName}`)
//     const { data, error } = await supabase.storage
//       .from("uploaded-files")
//       .upload(prefixedName, file)
//     if (error) {
//       console.error("Error uploading file:", error.message)
//       setUploadStatus(`Error uploading: ${prefixedName} - ${error.message}`)
//     } else {
//       setUploadStatus(`Upload complete: ${prefixedName}`)
//       await upsertUserContent(prefixedName)
//     }
//   }

//   const upsertUserContent = async (fileName: string) => {
//     try {
//       await supabase
//         .from("user_content")
//         .upsert({
//           user_id: user.id,
//           file_name: fileName,
//         })
//     } catch (error) {
//       console.error("Error upserting user content:", error)
//     }
//   }

//   const handleSubmitSuggestions = async () => {
//     if (!user) {
//       alert("Please log in to submit text.")
//       return
//     }
//     try {
//       await supabase
//         .from("user_content")
//         .upsert({
//           user_id: user.id,
//           user_text: userText,
//           file_list: files.map((f) => `${user.id}_${f.name}`),
//           original_file_names: files.map((f) => f.name),
//           ai_generated_files: [],
//         })
//       setTextStatus("Text submitted successfully.")
//       fetchStoredData()
//     } catch (error) {
//       console.error("Error storing suggestions:", error)
//       setTextStatus("Error submitting text.")
//     }
//   }

//   const fetchStoredData = async () => {
//     if (!user) return
//     const { data, error } = await supabase
//       .from("user_content")
//       .select("*")
//       .eq("user_id", user.id)
//     if (error) {
//       console.error("Error fetching stored data:", error)
//     } else {
//       setStoredData(data)
//     }
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && e.shiftKey) {
//       e.preventDefault()
//       handleSubmitSuggestions()
//     }
//   }

//   const triggerFileInput = () => fileInputRef.current?.click()

//   useEffect(() => {
//     if (user) {
//       fetchStoredData()
//     }
//   }, [user])

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-grow container py-24 px-10">
//         <h1 className="text-4xl font-bold mb-8">Get Started with DesignAI</h1>
//         {!user && <p className="text-red-500">Please log in to continue.</p>}
//         <div className="grid gap-8 md:grid-cols-2">
//           <div>
//             <h2 className="text-2xl font-semibold mb-4 mt-6">Upload Your Files</h2>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               accept=".html,.css,.js,.jsx,.ts,.tsx"
//               multiple
//               className="hidden"
//             />
//             <button
//               onClick={triggerFileInput}
//               className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
//             >
//               Upload Files
//             </button>
//             {files.length > 0 && (
//               <ul className="mt-4">
//                 {files.map((file) => (
//                   <li key={file.name}>
//                     <p>
//                       {file.name}
//                       {uploadStatus.includes(file.name) && ` (${uploadStatus})`}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//             <h2 className="text-2xl font-semibold mt-14">Share Your Vision</h2>
//             <textarea
//               ref={textAreaRef}
//               onInput={() => {
//                 setUserText(textAreaRef.current?.value || "")
//                 autoSize()
//               }}
//               onKeyDown={handleKeyDown}
//               placeholder="Mention how you'd like the website to look"
//               className="
//                 mt-2
//                 w-full
//                 p-2
//                 border-2
//                 border-primary-500
//                 rounded-md
//                 resize-none
//                 overflow-hidden
//                 outline-none
//                 focus:border-transparent
//                 focus:ring-2
//                 focus:ring-offset-2
//                 focus:ring-primary
//                 transition
//               "
//               rows={1}
//             />
//             <div className="flex items-center mt-4 space-x-2">
//               <button
//                 onClick={handleSubmitSuggestions}
//                 className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
//               >
//                 Send My Ideas
//               </button>
//               <span className="text-xs text-muted-foreground">
//                 Press Shift + Enter to share your thoughts instantly!
//               </span>
//             </div>
//             {textStatus && <p className="mt-2 text-sm text-green-500">{textStatus}</p>}
//           </div>
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
//             <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
//               <p className="text-muted-foreground">
//                 {files.length > 0
//                   ? "Processing your files..."
//                   : "Your design preview will appear here"}
//               </p>
//             </div>
//             <h2 className="text-2xl font-semibold mt-14">Stored Data</h2>
//             {storedData.length > 0 ? (
//               <ul className="mt-4">
//                 {storedData.map((data) => (
//                   <li key={data.user_id}>
//                     <p>User Text: {data.user_text}</p>
//                     <p>Files: {data.file_list.join(", ")}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-muted-foreground">No data stored yet.</p>
//             )}
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }

'use client'

import { useState, useRef, useCallback, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export default function GetStarted() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [textStatus, setTextStatus] = useState<string>("")
  const [user, setUser] = useState<any>(null)
  const [userText, setUserText] = useState<string>("")
  const [storedData, setStoredData] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
    }
    fetchUser()
  }, [supabase])

  const autoSize = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }
  }, [])

  useEffect(() => {
    autoSize()
  }, [files, autoSize])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      alert("Please log in to upload files.")
      return
    }
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files)
      setFiles(uploadedFiles)
      uploadedFiles.forEach(uploadFileToSupabase)
    }
  }

  const uploadFileToSupabase = async (file: File) => {
    if (!user) return
    const prefixedName = `${user.id}_${file.name}`
    setUploadStatus(`Uploading: ${prefixedName}`)
    const { data, error } = await supabase.storage
      .from("uploaded-files")
      .upload(prefixedName, file)
    if (error) {
      console.error("Error uploading file:", error.message)
      setUploadStatus(`Error uploading: ${prefixedName} - ${error.message}`)
    } else {
      setUploadStatus(`Upload complete: ${prefixedName}`)
      await upsertUserContent(prefixedName)
    }
  }

  const upsertUserContent = async (fileName: string) => {
    try {
      console.log("Upserting user content:", {
        user_id: user.id,
        file_name: fileName,
      })
      const { data, error } = await supabase
        .from("user_content")
        .upsert({
          user_id: user.id,
          file_name: fileName,
        })
      if (error) {
        console.error("Error upserting user content:", error)
      } else {
        console.log("Upserted user content:", data)
      }
    } catch (error) {
      console.error("Error upserting user content:", error)
    }
  }

  const handleSubmitSuggestions = async () => {
    if (!user) {
      alert("Please log in to submit text.")
      return
    }
    try {
      console.log("Submitting suggestions:", {
        user_id: user.id,
        user_text: userText,
        file_list: files.map((f) => `${user.id}_${f.name}`),
        original_file_names: files.map((f) => f.name),
        ai_generated_files: [],
      })
      const { data, error } = await supabase
        .from("user_content")
        .upsert({
          user_id: user.id,
          user_text: userText,
          file_list: files.map((f) => `${user.id}_${f.name}`),
          original_file_names: files.map((f) => f.name),
          ai_generated_files: [],
        })
      if (error) {
        console.error("Error storing suggestions:", error.message, error.details, error.hint)
        setTextStatus("Error submitting text.")
      } else {
        console.log("Suggestions submitted:", data)
        setTextStatus("Text submitted successfully.")
        fetchStoredData()
      }
    } catch (error) {
      console.error("Error storing suggestions:", error)
      setTextStatus("Error submitting text.")
    }
  }

  const fetchStoredData = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from("user_content")
      .select("*")
      .eq("user_id", user.id)
    if (error) {
      console.error("Error fetching stored data:", error)
    } else {
      console.log("Fetched stored data:", data)
      setStoredData(data)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault()
      handleSubmitSuggestions()
    }
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  useEffect(() => {
    if (user) {
      fetchStoredData()
    }
  }, [user])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-24 px-10">
        <h1 className="text-4xl font-bold mb-8">Get Started with DesignAI</h1>
        {!user && <p className="text-red-500">Please log in to continue.</p>}
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-4 mt-6">Upload Your Files</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".html,.css,.js,.jsx,.ts,.tsx"
              multiple
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Upload Files
            </button>
            {files.length > 0 && (
              <ul className="mt-4">
                {files.map((file) => (
                  <li key={file.name}>
                    <p>
                      {file.name}
                      {uploadStatus.includes(file.name) && ` (${uploadStatus})`}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <h2 className="text-2xl font-semibold mt-14">Share Your Vision</h2>
            <textarea
              ref={textAreaRef}
              onInput={() => {
                setUserText(textAreaRef.current?.value || "")
                autoSize()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Mention how you'd like the website to look"
              className="
                mt-2
                w-full
                p-2
                border-2
                border-primary-500
                rounded-md
                resize-none
                overflow-hidden
                outline-none
                focus:border-transparent
                focus:ring-2
                focus:ring-offset-2
                focus:ring-primary
                transition
              "
              rows={1}
            />
            <div className="flex items-center mt-4 space-x-2">
              <button
                onClick={handleSubmitSuggestions}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Send My Ideas
              </button>
              <span className="text-xs text-muted-foreground">
                Press Shift + Enter to share your thoughts instantly!
              </span>
            </div>
            {textStatus && <p className="mt-2 text-sm text-green-500">{textStatus}</p>}
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
            <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-2xl font-semibold mb-2">Coming Soon: Live Preview</h3>
              <p className="text-muted-foreground">
                We're working hard to bring you real-time design previews. 
                Stay tuned for this exciting feature that will help bring your ideas to life!
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}