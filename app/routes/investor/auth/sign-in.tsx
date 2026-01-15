import {SignIn} from '@clerk/react-router'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-white mb-2">Investor Portal</h1>
          <p className="text-white/60">Sign in to access investment opportunities</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-white shadow-xl',
              headerTitle: 'font-display',
              primaryButton: 'bg-[#c9a961] hover:bg-[#b8944d]',
            },
          }}
          routing="path"
          path="/investor/auth/sign-in"
          signUpUrl="/investor/auth/sign-up"
          forceRedirectUrl="/investor/dashboard"
        />
      </div>
    </div>
  )
}
