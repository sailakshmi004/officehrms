"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

export default function SwaggerPage() {
    const [spec, setSpec] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpec = async () => {
            try {
                const response = await fetch("/api/swagger-spec");
                const data = await response.json();
                setSpec(data);
            } catch (error) {
                console.error("Failed to fetch Swagger spec:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpec();
    }, []);

    if (loading) {
        return <div className="p-8">Loading API documentation...</div>;
    }

    if (!spec) {
        return <div className="p-8 text-red-600">Failed to load API documentation</div>;
    }

    return <SwaggerUI spec={spec} />;
}
