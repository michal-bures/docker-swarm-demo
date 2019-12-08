

export async function fetchCustomers() {
    const response = await fetch('/Customers');
    if (!response.ok) throw Error(response.statusText);
    return response.json();
}

export async function fetchInvoices() {
    const response = await fetch('/Invoices');
    if (!response.ok) throw Error(response.statusText);
    return response.json();
}


export async function createCustomer(name: string, address: string) {
    const response = await fetch('/Customers', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name, address
        })
    });
    if (!response.ok) throw Error(response.statusText);
}


export interface NewInvoice {
    productId: string,
    quantity: number
}

export async function createInvoice(invoice: NewInvoice) {
    const response = await fetch('/Invoices', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice)
    });
    if (!response.ok) throw Error(response.statusText);
}
