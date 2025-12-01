interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
      {message}
    </div>
  );
};