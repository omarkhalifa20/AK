import React from 'react'

export default function EmailConfirm() {
  return (
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
            <div className="emailconfirmimage mb-10">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7L9.00004 18L3.99994 13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </div> 
            <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
            <p className="mb-4">Please check your email and click the confirmation link to activate your account.</p>
            <p className="text-sm text-gray-600">If you didnt receive the email, please check your spam folder or try signing up again.</p>
            </div>
        </div>
    </>
  )
}
