import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <form onSubmit={submit} className={cn('flex flex-col gap-6', className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="m@example.com"
                        required
                    />
                    <InputError message={errors.email} />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a href={route('password.request')} className="ml-auto text-sm underline-offset-4 hover:underline">
                            Forgot your password?
                        </a>
                    </div>
                    <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                    <InputError message={errors.password} />
                </div>
                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        name="remember"
                        checked={data.remember}
                        onClick={() => setData('remember', !data.remember)}
                        tabIndex={3}
                    />
                    <Label htmlFor="remember">Remember me</Label>
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>
            </div>
        </form>
    );
}
