package io.udash.todo.views

import io.udash._
import io.udash.todo.RootState
import org.scalajs.dom.Element

object RootViewPresenter extends DefaultViewPresenterFactory[RootState.type](() => new RootView)

class RootView extends View {

  import scalatags.JsDom.all._

  private val child: Element = div().render

  override val getTemplate: Modifier =
    div(
      h1("todos"),
      child
    )

  override def renderChild(view: View): Unit = {
    for (i <- 0 until child.childNodes.length)
      child.removeChild(child.childNodes(i))
    view.getTemplate.applyTo(child)
  }
}
