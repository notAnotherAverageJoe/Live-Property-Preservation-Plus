import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pagesCSS/Tutorial.css";

function Tutorial() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate(); // Add this line

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="tutorial">
      <h2>Tutorial</h2>
      {step === 1 && (
        <div className="tutorial-step">
          <p>
            Welcome to Property Preservation Plus! We are excited you are here.
            In this tutorial, we'll walk you through the key features.
          </p>
          <button className="pill-link" onClick={nextStep}>
            Next
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="tutorial-step">
          <p>
            First things first! You will need to register. You will need to
            create a company! Once this is done, you will be brought to your own
            private dashboard.
          </p>
          <img
            src="/dashboard.png"
            alt="Dashboard"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <button className="pill-link" onClick={previousStep}>
            Back
          </button>
          <button className="pill-link" onClick={nextStep}>
            Next
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="tutorial-step">
          <p>
            After registration, you will notice the maintenance guide, you will
            have access to weather from around the world available at your
            finger tips. However, once you type in a city and state you won't
            just receive weather. You will get a plethora of information and
            preventative actions to consider based upon the weather, storms and
            even humidity!
          </p>
          <img
            src="/weather.png"
            alt="Weather Overview"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <button className="pill-link" onClick={previousStep}>
            Back
          </button>
          <button className="pill-link" onClick={nextStep}>
            Next
          </button>
        </div>
      )}
      {step === 4 && (
        <div className="tutorial-step">
          <p>
            Next we will look at the dashboard navbar!. Click on All properties
            and you will see a screen like the image below. Of course yours
            won't have a property yet, that's for you to create! Since you are a
            creator of this account you can do essentially anything you want.
            Create a property, edit it, delete it. It is up to you. For your
            safety, we have ensured that you cannot delete a property if it has
            units or financial expenses attached to it! Let's dive deeper.
          </p>
          <img
            src="/property.png"
            alt="Property"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <button className="pill-link" onClick={previousStep}>
            Back
          </button>
          <button className="pill-link" onClick={nextStep}>
            Next
          </button>
        </div>
      )}
      {step === 5 && (
        <div className="tutorial-step">
          <p>
            Once you click on the property you have created you will see a
            similar screen as the image below. Here you can create all the units
            you would like to be associated with the current property! This is
            also the case for financial expenses. No negative numbers can go
            into either input! Once you create a unit you will be able to click
            the maintenance request button and create, edit, update, and delete
            maintenance requests specifically for that unit! Now let's click the
            budget forecast button!
          </p>
          <img
            src="/propdet.png"
            alt="Property Management"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <button className="pill-link" onClick={previousStep}>
            Back
          </button>
          <button className="pill-link" onClick={nextStep}>
            Next
          </button>
        </div>
      )}
      {step === 6 && (
        <div className="tutorial-step">
          <p>
            This is where things really get exciting! On this page you can pick
            any of the properties you have created and once chosen, all the rent
            amount collected from units is added together and combined with the
            financial expenses. Financial expenses, of course, reduce the
            overall revenue from the rent amounts, but with proper planning and
            persistence, we can work towards reducing the overall financial
            expenses. This is where PPP comes in! Our goal is to offer a system
            that pulls together business data and actively works towards proper
            maintenance to maximize property value while preserving it as best
            we can!
          </p>
          <img
            src="/budget.png"
            alt="Budget"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <button className="pill-link" onClick={previousStep}>
            Back
          </button>
          <button className="pill-link" onClick={nextStep}>
            Next
          </button>
        </div>
      )}
      {step === 7 && (
        <div className="tutorial-step">
          <p>
            Congratulations! You've completed the tutorial! There is still so
            much more of PPP to offer. However, we know we can't keep you
            forever! Go and explore the many uses and values this program
            offers. We thank you so much for stopping by! And we hope PPP will
            strengthen your property management portfolio!
          </p>
          <button className="pill-link" onClick={handleClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Tutorial;
