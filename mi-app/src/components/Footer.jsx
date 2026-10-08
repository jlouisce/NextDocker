import React from 'react';
import logo from '../assets/figma/logo.png';

const links = ['Privacy Policy', 'Terms of Service', 'Port Network', 'Support'];

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-[#eaeaea] mt-auto">
      <div className="max-w-[1728px] mx-auto px-6 lg:px-[45px] py-8 lg:h-[125px] flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-[32px] font-bold">
          <img src={logo} alt="" className="h-[37px] w-[36px] object-cover" />
          NextDocker
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 font-mono text-base font-bold tracking-[0.07em]">
          {links.map((label) => (
            <a key={label} href="#" className="hover:text-white transition-colors">{label}</a>
          ))}
        </div>

        <div className="font-roboto font-light text-base lg:text-xl tracking-[0.01em]">
          2024 NextDocker Logistics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
