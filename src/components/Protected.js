import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Protected({ token }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProtectedData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/protected', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message);
                }

                setData(result);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProtectedData();
    }, [token, navigate]);

    if (!token) {
        return null;
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title mb-4">Protected Page</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {data && (
                        <div className="alert alert-success">
                            <p>{data.message}</p>
                            <p className="mt-2">Welcome, {data.user.username}!</p>
                            <p className="mt-2" >Token: {localStorage.getItem('token')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Protected;
