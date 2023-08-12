import { HiCheckCircle } from 'react-icons/hi';
import { Steps } from '..';

interface IStep {
  step: Steps;
}

const Step = ({ step }: IStep) => {
  if (step === '2')
    return (
      <ol className="flex items-center w-full text-sm font-medium text-center text-slate-50 sm:text-base mb-4 justify-center">
        <li className="flex text-blue-cerulean-tint md:w-full items-center sm:after:content-[''] after:w-16 after:h-[2.5px] after:bg-blue-cerulean-tint after:rounded-lg after:hidden sm:after:inline-block after:mx-6 xl:after:mx-4">
          <HiCheckCircle className="mr-1" size={18} />
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
            E-mail{' '}
            <span className="hidden sm:inline-flex sm:ml-2">address</span>
          </span>
        </li>
        <li className="flex md:w-full items-center after:content-[''] after:w-16 after:h-[2.5px] after:bg-slate-50 after:rounded-lg after:hidden sm:after:inline-block after:mx-6 xl:after:mx-4">
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
            <span className="mr-2">2</span>
            Verification{' '}
            <span className="hidden sm:inline-flex sm:ml-2">Code</span>
          </span>
        </li>
        <li className="flex items-center">
          <span className="mr-2">3</span>
          Password <span className="hidden sm:inline-flex sm:ml-2">Update</span>
        </li>
      </ol>
    );

  if (step === '3')
    return (
      <ol className="flex items-center w-full text-sm font-medium text-center text-slate-50 sm:text-base mb-4 justify-center">
        <li className="flex text-blue-cerulean-tint md:w-full items-center sm:after:content-[''] after:w-16 after:h-[2.5px] after:bg-blue-cerulean-tint after:rounded-lg after:hidden sm:after:inline-block after:mx-6 xl:after:mx-4">
          <HiCheckCircle className="mr-1" size={18} />
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
            E-mail{' '}
            <span className="hidden sm:inline-flex sm:ml-2">address</span>
          </span>
        </li>
        <li className="flex text-blue-cerulean-tint md:w-full items-center after:content-[''] after:w-16 after:h-[2.5px] after:bg-blue-cerulean-tint after:rounded-lg after:hidden sm:after:inline-block after:mx-6 xl:after:mx-4">
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
            <HiCheckCircle className="mr-1" size={18} />
            Verification{' '}
            <span className="hidden sm:inline-flex sm:ml-2">Code</span>
          </span>
        </li>
        <li className="flex items-center">
          <span className="mr-2">3</span>
          Password <span className="hidden sm:inline-flex sm:ml-2">Update</span>
        </li>
      </ol>
    );

  return (
    <ol className="flex items-center w-full text-sm font-medium text-center text-slate-50 sm:text-base mb-4 justify-center">
      <li className="flex md:w-full items-center sm:after:content-[''] after:w-16 after:h-[2.5px] after:bg-slate-50 after:rounded-lg after:hidden sm:after:inline-block after:mx-6 xl:after:mx-4">
        <span className="mr-2">1</span>
        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
          E-mail <span className="hidden sm:inline-flex sm:ml-2">address</span>
        </span>
      </li>
      <li className="flex md:w-full items-center after:content-[''] after:w-16 after:h-[2.5px] after:bg-slate-50 after:rounded-lg after:hidden sm:after:inline-block after:mx-6 xl:after:mx-4">
        <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
          <span className="mr-2">2</span>
          Verification{' '}
          <span className="hidden sm:inline-flex sm:ml-2">Code</span>
        </span>
      </li>
      <li className="flex items-center">
        <span className="mr-2">3</span>
        Password <span className="hidden sm:inline-flex sm:ml-2">Update</span>
      </li>
    </ol>
  );
};

export default Step;
