import { useState } from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { FAQ } from '../assets';

const FAQItem = ({ questionNumber, question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex-col cursor-pointer" onClick={toggleExpanded}>
      <div className="flex flex-row justify-between items-center border-b-2">
        <h2 className="text-lg font-normal font-montserrat">
          <span className="text-3xl font-bold font-montserrat">{questionNumber}. </span>
          {question}
        </h2>
        <button onClick={toggleExpanded}>
          {expanded ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>
      {expanded && (
        <div className=" p-2 flex flex-row">
          <p className="body-text">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQs = () => {
  return (
    <section className="w-full mx-auto">
      <h1 className="header-text text-center max-w-xl mx-auto">
        Frequently Asked Questions
      </h1>
      <div className="flex md:flex-row-reverse flex-col gap-10 pt-10 md:px-8 mx-auto">
        <div className="lg:w-3/5 flex flex-col pt-8">
        <FAQItem
            questionNumber={1}
            question="What does NAMSSN stand for?"
            answer="NAMSSN stands for the National Association of Mathematical Sciences Students of Nigeria."
          />

          <FAQItem
            questionNumber={2}
            question="Is this website affiliated with NAMSSN at the national level?"
            answer="No, this website is specifically for the NAMSSN FUTMINNA chapter, which is based at the Federal University of Technology Minna."
          />

          <FAQItem
            questionNumber={3}
            question="How can I become a member of NAMSSN FUTMINNA?"
            answer="To become a member of NAMSSN FUTMINNA, you can visit our Membership page and follow the registration process outlined there."
          />

          <FAQItem
            questionNumber={4}
            question="What benefits do NAMSSN members receive?"
            answer="NAMSSN members enjoy various benefits, including access to educational resources, participation in events, and networking opportunities with fellow mathematics enthusiasts."
          />

          <FAQItem
            questionNumber={5}
            question="Can I contribute to the content on this website?"
            answer="Yes, we welcome contributions from our members. If you have articles, blogs, or other content related to mathematics that you'd like to share, please contact our admin team for more information on how to contribute."
          />
        </div>
        <div className="max-w-10 mx-auto">
          <img src={FAQ} alt="FAQ" className="w-full pt-8" />
        </div>
      </div>
    </section>
  );
};

export default FAQs;
