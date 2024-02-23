"use client"
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import { useEffect } from "react";
import Content from "./components/content";

export default function DashboardLayout({
    children,
  }) {
    const { isLoggedIn, login, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
      console.log(isLoggedIn)
        if(!isLoggedIn){
            router.push('/login')
        } 
    }, []);
    return (
      <>
          <section className='bg-gray-100 h-screen'>
            {
                <div className="bg-gray-100 h-full">
                  <Navbar />  
                  <div className="flex flex-row h-full">  
                    <Sidebar />
                    <Content>
                      {children}
                    </Content>
                  </div>
                </div>
            }
          </section>
      </>
    )
  }