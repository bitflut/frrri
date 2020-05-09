import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsIndexComponent } from './posts-index.component';


describe('PostsIndexComponent', () => {
    let component: PostsIndexComponent;
    let fixture: ComponentFixture<PostsIndexComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostsIndexComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PostsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
