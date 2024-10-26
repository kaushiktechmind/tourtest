import Image from "next/image";
import Link from "next/link";

const HeaderTop = () => {
  return (
    <div className="bg-[var(--bg-1)] border-b lg:border-b-0">
      <div className="container mx-auto flex justify-between py-3 lg:py-5 gap-1">
        <Link href="/" className="flex items-center">
          <Image
            src="https://www.andamanmangroves.com/static/media/logo.00922eff5313640b23f9.png"
            className="self-center hidden xl:block"
            width={172}
            height={48}
            alt="logo"
            priority
          />
          <Image
            src="/img/favicon.png"
            className="self-center xl:hidden w-[40px] h-[40px] ml-3"
            width={56}
            height={40}
            alt="logo"
            priority
          />
        </Link>
      </div>
    </div>
  );
};

export default HeaderTop;
