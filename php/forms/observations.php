<section>

    <h2>Valoración registrada con éxito</h2>
    <p>Hemos tomado nota de su opinión, muchas gracias.</p>
    <p>El siguiente formulario está reservado para que lo cumplimente el facilitador, ya ha terminado su labor como usuario.</p>
    <form action="#" method="post" name="observationsForm">
        <label for="observaciones">Observaciones sobre el test:</label>
        <textarea name="observaciones" id="observaciones"></textarea>
        <?php
            $_SESSION["test"]->showProwessSelector();
        ?>
        <input type="submit" name="sendObservations" value="Enviar observaciones"/>
    </form>
</section>