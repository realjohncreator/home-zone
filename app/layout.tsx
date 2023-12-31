import "./globals.css";
import {Nunito} from "next/font/google";
import React from "react";

import Navbar from "@/app/components/Navbar/Navbar";
import RegistrationModal from "@/app/components/Modals/RegistrationModal";
import LoginModal from "@/app/components/Modals/LoginModal";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ToasterProvider from "@/app/providers/ToasterProvider";
import RentModal from "@/app/components/Modals/RentModal";
import SearchModal from "@/app/components/Modals/SearchModal";
import Footer from "@/app/components/Footer/Footer";

const nunito = Nunito({subsets: ["latin"]});

export const metadata = {
    title: "Home Zone",
    description: "Home Zone is a website for the home zone of everyone looking for a place to live.",
    keywords: "home zone, home, zone, place, live, rent, buy, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment, house, apartment"
};

export default async function RootLayout({children}: { children: React.ReactNode }) {
    const currentUser = await getCurrentUser();

    return (
        <html lang="en">
        <body className={nunito.className}>

        {/*client component*/}
        <ToasterProvider/>
        <Navbar currentUser={currentUser}/>
        <SearchModal/>
        <RentModal/>
        <RegistrationModal/>
        <LoginModal/>
        {/*client component*/}

        <div className="min-h-screen flex flex-col">
            <div className="flex-grow py-4">
                {children}
            </div>

            <div className="mt-auto">
                <Footer/>
            </div>
        </div>
        </body>
        </html>
    );
}
