export default class Modal {

    exibeModal(mensagem) {
        Swal.fire({
            title: mensagem,
            showClass: {
                popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                `
            },
            hideClass: {
                popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                `
            }
        });
    }
    
    exibepergunta(titulo = "Deseja realmente apagar?", texto = "Esta ação não pode ser revertida!") {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            return swalWithBootstrapButtons.fire({
                title: titulo,
                text: texto,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, Quero apagar!",
                cancelButtonText: "Cancelar!",
                reverseButtons: true
            });

    }
}
