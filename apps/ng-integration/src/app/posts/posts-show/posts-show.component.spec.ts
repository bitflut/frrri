import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsShowComponent } from './posts-show.component';


describe('PostsShowComponent', () => {
    let component: PostsShowComponent;
    let fixture: ComponentFixture<PostsShowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostsShowComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PostsShowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
