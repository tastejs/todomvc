package io.udash.todo.views

import io.udash._
import io.udash.todo.ErrorState
import org.scalajs.dom.Element

object ErrorViewPresenter extends DefaultViewPresenterFactory[ErrorState.type](() => new ErrorView)

class ErrorView extends FinalView {
  import scalatags.JsDom.all._

  override val getTemplate: Modifier =
    h3("URL not found!")
}
