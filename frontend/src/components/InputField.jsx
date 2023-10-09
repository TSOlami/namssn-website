const InputField = ({ type, name, id, placeholder, value, onChange, icon, pad }) => {
  return (
    <div className="flex flex-row relative w-full">
      <input
        type={type}
        name={name}
        id={id}
        onChange={onChange}
        value={value}
        className={pad? "border-2 rounded border-gray-400 h-[40px] p-2 w-full pl-10" : "border-2 rounded border-gray-400 h-[40px] p-2 w-full"}
        placeholder={placeholder}
      />
      {icon && <div className="absolute left-2 flex self-center justify-center">{icon}</div>}
    </div>
  );
};

export default InputField;
