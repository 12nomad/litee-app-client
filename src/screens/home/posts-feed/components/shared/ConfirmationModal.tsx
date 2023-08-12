import Spinner from '../../../../../components/ui/Spinner';

interface IConfirmationModal {
  onCloseModal: () => void;
  onMutation: () => void;
  isLoading: boolean;
  title: string;
  buttonLabel: string;
}

const ConfirmationModal = ({
  onCloseModal,
  isLoading,
  onMutation,
  buttonLabel,
  title,
}: IConfirmationModal) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-1/4 p-8 text-center bg-black-rich rounded-md border border-black-rich-tint"
    >
      {title}
      <div className="flex items-center justify-center mt-4 gap-4">
        <button
          type="button"
          className="inline-flex gap-1 items-center py-2.5 px-4 text-xs font-medium text-center text-white-powder  rounded-md focus:ring-1 dark:focus:ring-white-powder bg-rose-700"
          disabled={isLoading}
          onClick={onMutation}
        >
          {isLoading ? <Spinner /> : buttonLabel}
        </button>
        <button
          type="button"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white-powder  rounded-md focus:ring-1 dark:focus:ring-white-powder bg-black-rich-tint"
          onClick={onCloseModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
