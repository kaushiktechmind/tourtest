const SubHeadingBtn = (props: any) => {
  const { text, classes } = props;
  return (
    <span className={`${classes} p-1 rounded-full inline-flex items-center`}>
      <i className="las la-arrow-right p-2 md:p-3 rounded-full bg-primary text-white"></i>
      <span className="text-base sm:text-lg lg:text-xl font-medium sm:font-semibold px-2 sm:px-3 md:px-4">
        {text}
      </span>
    </span>
  );
};

export default SubHeadingBtn;
