import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';

export const alertLayoutReact = (Component) => {
    const container = document.createElement('div');
    Swal.fire({
        title: '',
        html: container,
        width: '70%',
        didOpen: () => {
            // Render component vào container khi popup mở
            const root = ReactDOM.createRoot(container);
            root.render(<Component />);
        },
        customClass: {
            confirmButton: 'btn-confirm',
            popup: 'swal-scrollable'
        },
    });
};
