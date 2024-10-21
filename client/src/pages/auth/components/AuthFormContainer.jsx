export default function AuthFormContainer({ children, title, subtitle }) {
  return (
    <div className="w-96 relative bg-white overflow-hidden p-[2px] mr-6 mt-12">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#3F71FF] to-[#AA54FF]"></div>
      <div className="bg-white z-1 relative p-6 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="pb-1 text-2xl">{title}</p>
          <p className="text-[0.8rem]">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
