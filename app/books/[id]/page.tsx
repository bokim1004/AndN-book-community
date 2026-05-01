interface BookDetailPageProps {
    params: { id: string };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
    return (
        <div>
            <h1>책 상세 + 감상</h1>
            <p>Book ID: {params.id}</p>
        </div>
    );
}
