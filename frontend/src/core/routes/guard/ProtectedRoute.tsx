import { Navigate } from "react-router-dom";
import {type ReactNode} from "react";
import {AuthStore} from '../../components/auth/services/AuthStore';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const isAuthenticated = AuthStore.isAuthenticated();
    const userRole = AuthStore.getUserRole();
    
    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute - userRole:', userRole);
    console.log('ProtectedRoute - requiredRole:', requiredRole);

    if(!isAuthenticated) {
        console.log('Redirecting to login - not authenticated');
        return <Navigate to="/login" replace />;
    }

    if(requiredRole){
        if(userRole !== requiredRole){
            console.log('Redirecting to unauthorized - wrong role');
            return <Navigate to="/unauthorized" replace />;
        }
    }
    
    console.log('ProtectedRoute - Allowing access');
    return <>{children}</>;
};