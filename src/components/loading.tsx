import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <Image src="/nyan-cat.gif" width={200} height={100} alt="loading..." />
    </div>
  );
}
