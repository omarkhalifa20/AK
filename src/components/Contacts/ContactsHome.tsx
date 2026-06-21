"use client"
import { Facebook, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { motion, useAnimation } from "framer-motion";

export default function ContactsHome() {
  return (
    <>
    <div id='contacts' className='contacts-bg overflow-x-hidden py-10'>
      <motion.div 
       initial={{  opacity: 0 }} 
       whileInView={{ opacity: 1 }}
       transition={{ duration: 2, ease: "easeIn"}}
       viewport={{ once: true }}
      className='container  backdrop-blur-[8px] rounded-3xl bg-[#ffffff18] w-[90%] mx-auto px-20 py-10'>
        <div className='grid grid-cols-12 gap-9'>
           <motion.div
            initial={{ x:-150 , opacity: 0 }} 
            whileInView={{ x:0, opacity: 1 }}
            transition={{ duration: 2, ease: "easeIn"}}
            viewport={{ once: true }}
            className='col-span-6 flex  '>
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5087.904229758931!2d30.12451938157551!3d31.141569378288985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2seg!4v1770297997758!5m2!1sen!2seg"  className='rounded-2xl min-h-120 w-full'  style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
         </motion.div>
         <motion.div 
          initial={{ x:150 , opacity: 0 }} 
          whileInView={{ x:0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeIn"}}
          viewport={{ once: true }}
         className='col-span-6 flex flex-col text-white justify-start     '>
           <h3 className=' text-center mb-5  text-[35px] font-bold Orbitron'>Contacts Us</h3>
           
           <p className='mb-2 Marhey'>Address : Ahmed Orabi St - Elmezana - Kafr Eldwwar - Behira</p>
           <p className='mb-12 Marhey'>Phone : 01000000000</p>
            
          <h3 className='text-[20px] text-center font-bold Orbitron'>Our Social Media</h3>

           <div className='grid grid-cols-12  gap-7 mt-5'>
               
           <div className="contacts-btn col-span-3 p-2 ">
           <Link className='strong' href='00'><Facebook /></Link>
           <div id="container-stars">
           <div id="stars" />
           </div>
           <div id="glow">
           <div className="circle" />
           <div className="circle" />
           </div>
           </div>

           <div className="contacts-btn col-span-3 p-2 ">
           <Link className='strong' href='00'><Instagram /></Link>
           <div id="container-stars">
           <div id="stars" />
           </div>
           <div id="glow">
           <div className="circle" />
           <div className="circle" />
           </div>
           </div>

           <div className="contacts-btn col-span-3 p-2">
           <Link className='strong' href='00'><Twitter /></Link>
           <div id="container-stars">
           <div id="stars" />
           </div>
           <div id="glow">
           <div className="circle" />
           <div className="circle" />
           </div>
           </div>

           <div className="contacts-btn col-span-3 p-2">
           <Link className='strong' href='00'><svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                                              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                              </svg>
</Link>
           <div id="container-stars">
           <div id="stars" />
           </div>
           <div id="glow">
           <div className="circle" />
           <div className="circle" />
           </div>
           </div>

           </div>
            <p className='text-center mt-25 text-[17px] font-bold Orbitron '>Get in touch with us — we’re always here to help and connect.</p>
         </motion.div> 

         




        </div>
         
      </motion.div>
    </div>
    </>
  )
}
