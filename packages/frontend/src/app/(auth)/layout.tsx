import { FRUITS_SVG_BASE64 } from "@/constants/base64-image";
import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center bg-primary-orange-10 px-4 md:px-0 relative">
      <div className="text-center absolute top-10 md:top-20 left-1/2 -translate-x-1/2 w-full">
        <p className="font-semibold title-sm sm:title-md text-green-700">
          Langfarm Ticket
        </p>
        <p className="text-neutral-grey-400 text-lg font-normal">
          Quản lý bán vé
        </p>
      </div>

      <div className="z-10 w-full max-w-[500px] bg-neutral-white p-6 md:p-10 rounded-2xl border border-green-50">
        {children}
      </div>
      <div
        className="fixed bottom-0 w-full h-24 bg-cover md:bg-contain"
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="699" height="96"><image width="675" height="96" xlink:href="${FRUITS_SVG_BASE64}" /></svg>')`,
          backgroundPosition: "center",
          backgroundRepeat: "repeat-x",
        }}
      />
    </section>
  );
};

export default AuthLayout;
