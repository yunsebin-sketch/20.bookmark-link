import Image from "next/image";

// 라이트 모드에서는 mime-logo.png, 다크 모드에서는 mime-logo2.png(흰색 버전)를 보여준다.
// 두 이미지를 모두 렌더링하고 CSS(globals.css)의 [data-theme]로 교체하므로
// 인라인 스크립트가 테마를 정한 뒤에는 깜빡임 없이 올바른 로고가 표시된다.
export default function Logo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <>
      <Image
        src="/mime-logo.png"
        alt="춘천마임축제 로고"
        width={392}
        height={410}
        className={`logo-light ${className}`}
        priority
      />
      <Image
        src="/mime-logo2.png"
        alt="춘천마임축제 로고"
        width={392}
        height={410}
        className={`logo-dark ${className}`}
        priority
      />
    </>
  );
}
