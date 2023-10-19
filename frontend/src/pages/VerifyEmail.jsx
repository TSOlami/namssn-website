import { VerifyEmailSVG } from "../assets"
import { VerificationCodeInput } from "../components"
const VerifyEmail = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen">
      <div>
        <img src={VerifyEmailSVG} alt="" className="h-[200px]"/>
      </div>

      <div className="flex items-center flex-col">
        <h1 className="text-3xl font-bold">Verify your email</h1>
        <p className="p-2">Check your email for the six digit code sent to the email entered</p>

        <VerificationCodeInput codeLength={6}/>
      </div>
    </div>
  )
}

export default VerifyEmail