import { Ship } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-[#eaeaea] mt-auto">
      <div className="max-w-[1728px] mx-auto px-6 lg:px-[45px] py-8 lg:h-[125px] flex flex-col lg:flex-row justify-between items-center gap-4 text-center">
        <div className="flex items-center gap-3 text-2xl lg:text-[32px] font-bold">
          <Ship className="size-8" aria-hidden="true" />
          NextDocker
        </div>
        <p className="font-roboto font-light text-base lg:text-xl tracking-[0.01em]">
          2024 NextDocker Logistics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
