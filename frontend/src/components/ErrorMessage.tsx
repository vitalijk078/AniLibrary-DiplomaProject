interface ErrorMessageProps {
  text?: string;
}

export function ErrorMessage({ text = "Произошла ошибка при загрузке данных." }: ErrorMessageProps) {
  return <p className="message message--error">{text}</p>;
}
