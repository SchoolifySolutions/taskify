import { FC } from 'react';
import { AlertCircle } from 'lucide-react';


interface AlertDestructiveProps {
  description: string;
}

export const AlertDestructive: FC<AlertDestructiveProps> = ({ description }) => {
  return (
    <div className='px-[1vw] py-[1vh] border-[1px] min-w-[10vw] max-w-[38vw] fixed top-[1vw] left-[1vw] rounded-xl border-[red] h-fit '>
        <div className="flex gap-4">
      <AlertCircle className="h-4 w-4 my-auto" color='red'/>
      <h1 className="text-[red]">Error</h1>
      </div>
      <h1 className="text-[red] ml-8">{description}</h1>
      

    </div>
  );
};
