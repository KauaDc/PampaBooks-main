                    // Função para mostrar o modal
                    function showModal() {
                      
                        const modal = document.getElementById('cartModal');
                        modal.style.display = 'block';
                      }
                      
                      // Função para esconder o modal
                      function hideModal() {
                        const modal = document.getElementById('cartModal');
                        modal.style.display = 'none';
                      }
                      
                      // Configurar eventos no DOM Loaded
                      document.addEventListener('DOMContentLoaded', function() {
                        const closeButton = document.querySelector('.close');
                        const goToCartButton = document.getElementById('goToCart');
                      const continueShoppingButton = document.getElementById('continueShopping');
                      
                        // Botão de fechar modal
                        closeButton.addEventListener('click', hideModal);
                      
                        // Botão para ir ao carrinho
                        goToCartButton.addEventListener('click', function() {
                          window.location.href = '/pedidos'; // URL do carrinho
                        });
                      
                        // Botão para continuar comprando
                        continueShoppingButton.addEventListener('click', hideModal);
                      
                        // Botões para adicionar ao carrinho
                        document.querySelectorAll('.btn-add-to-cart').forEach(function(button) {
                          button.addEventListener('click', async function(e) {
                            e.preventDefault();
                      
                            const form = button.closest('form');
                            const formData = new FormData(form);
                            try {
                              const response = await fetch('/criarpedido', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(Object.fromEntries(formData))
                              });
                      
                              if (response.ok) {
                                showModal(); // Mostrar modal após adição ao carrinho
                              } else {
                                alert('Erro ao adicionar ao carrinho');
                              }
                            } catch (error) {
                              console.error('Erro ao adicionar ao carrinho:', error);
                            }
                          });
                        });
                      });
                      
                      // Fechar o modal ao clicar fora dele
                      window.onclick = function(event) {
                        const modal = document.getElementById('cartModal');
                        if (event.target == modal) {
                          hideModal();
                        }
                      };